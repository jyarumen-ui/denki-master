import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import {
  tools,
  Tool,
  ToolCategory,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  FREQUENCY_LABELS,
  FREQUENCY_COLORS,
} from '../data/tools';
import { colors, spacing, radius, fontSize } from '../theme';

const ALL = 'all' as const;
type FilterCategory = ToolCategory | typeof ALL;

const FILTERS: { key: FilterCategory; label: string }[] = [
  { key: ALL, label: 'すべて' },
  { key: 'measurement', label: '測定' },
  { key: 'cutting', label: '切断' },
  { key: 'wiring', label: '配線' },
  { key: 'safety', label: '安全' },
];

interface ToolCardProps {
  item: Tool;
  onPress: () => void;
}

function ToolCard({ item, onPress }: ToolCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardImageBox}>
        {item.imageUrl && !imgError ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.cardImage}
            resizeMode="contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <Text style={styles.cardEmoji}>{item.emoji}</Text>
        )}
      </View>
      <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
      <View style={[styles.badge, { backgroundColor: CATEGORY_COLORS[item.category] + '22' }]}>
        <Text style={[styles.badgeText, { color: CATEGORY_COLORS[item.category] }]}>
          {CATEGORY_LABELS[item.category]}
        </Text>
      </View>
      <View style={[styles.freqBadge, { backgroundColor: FREQUENCY_COLORS[item.examFrequency] }]}>
        <Text style={styles.freqBadgeText}>{FREQUENCY_LABELS[item.examFrequency]}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ToolsScreen() {
  const [filter, setFilter] = useState<FilterCategory>(ALL);
  const [selected, setSelected] = useState<Tool | null>(null);
  const [modalImgError, setModalImgError] = useState(false);

  const filtered = filter === ALL ? tools : tools.filter((t) => t.category === filter);

  const openTool = (tool: Tool) => {
    setModalImgError(false);
    setSelected(tool);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚡ 道具図鑑</Text>
        <Text style={styles.headerSub}>電気工事の必携ツール {tools.length}種</Text>
      </View>

      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={filter === f.key ? [styles.filterChip, styles.filterChipActive] : styles.filterChip}
              onPress={() => setFilter(f.key)}
            >
              <Text style={filter === f.key ? [styles.filterChipText, styles.filterChipTextActive] : styles.filterChipText}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <ToolCard item={item} onPress={() => openTool(item)} />
        )}
      />

      <Modal visible={!!selected} animationType="slide" transparent onRequestClose={() => setSelected(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selected && (
                <>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalImageBox}>
                      {selected.imageUrl && !modalImgError ? (
                        <Image
                          source={{ uri: selected.imageUrl }}
                          style={styles.modalImage}
                          resizeMode="contain"
                          onError={() => setModalImgError(true)}
                        />
                      ) : (
                        <Text style={styles.modalEmoji}>{selected.emoji}</Text>
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalName}>{selected.name}</Text>
                      <Text style={styles.modalNameEn}>{selected.nameEn}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setSelected(null)} style={styles.closeBtn}>
                      <Text style={styles.closeBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.badgeRow}>
                    <View style={[styles.badge, { backgroundColor: CATEGORY_COLORS[selected.category] + '22' }]}>
                      <Text style={[styles.badgeText, { color: CATEGORY_COLORS[selected.category] }]}>
                        {CATEGORY_LABELS[selected.category]}
                      </Text>
                    </View>
                    <View style={[styles.freqBadge, { backgroundColor: FREQUENCY_COLORS[selected.examFrequency] }]}>
                      <Text style={styles.freqBadgeText}>
                        試験出題：{FREQUENCY_LABELS[selected.examFrequency]}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.sectionLabel}>用途</Text>
                  <Text style={styles.description}>{selected.description}</Text>

                  <Text style={styles.sectionLabel}>使い方のポイント</Text>
                  {selected.usageTips.map((tip, i) => (
                    <View key={i} style={styles.tipRow}>
                      <Text style={styles.tipBullet}>•</Text>
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  headerTitle: { color: colors.accent, fontSize: fontSize.xl, fontWeight: 'bold' },
  headerSub: { color: '#aaa', fontSize: fontSize.sm, marginTop: 2 },
  filterRow: { backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
  filterScroll: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, flexDirection: 'row' },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '600' },
  filterChipTextActive: { color: '#fff' },
  grid: { padding: spacing.sm },
  card: {
    flex: 1,
    margin: spacing.xs,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImageBox: {
    width: 100,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    backgroundColor: '#fff',
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  cardImage: { width: 96, height: 76 },
  cardEmoji: { fontSize: 40 },
  cardName: { fontSize: fontSize.sm, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: spacing.xs },
  badge: { borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3, marginTop: spacing.xs },
  badgeText: { fontSize: fontSize.xs, fontWeight: '600' },
  freqBadge: { borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3, marginTop: spacing.xs },
  freqBadgeText: { fontSize: fontSize.xs, color: '#fff', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    maxHeight: '85%',
  },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  modalImageBox: {
    width: 100,
    height: 100,
    borderRadius: radius.md,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  modalImage: { width: 96, height: 96 },
  modalEmoji: { fontSize: 56 },
  modalName: { fontSize: fontSize.xl, fontWeight: 'bold', color: colors.text },
  modalNameEn: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  closeBtn: { padding: spacing.sm },
  closeBtnText: { fontSize: fontSize.lg, color: colors.textSecondary },
  badgeRow: { flexDirection: 'row', marginBottom: spacing.md },
  sectionLabel: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  description: { fontSize: fontSize.md, color: colors.text, lineHeight: 22 },
  tipRow: { flexDirection: 'row', marginBottom: spacing.xs },
  tipBullet: { color: colors.accent, fontSize: fontSize.md, marginRight: spacing.xs, fontWeight: 'bold' },
  tipText: { flex: 1, fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },
});
